import { useCallback, useMemo, useRef, useState } from 'react';
import {
  type ArrayOfObjectsInputProps,
  insert,
  setIfMissing,
  unset,
  useClient,
} from 'sanity';
import { Box, Button, Card, Checkbox, Flex, Grid, Spinner, Stack, Text } from '@sanity/ui';
import { ImagesIcon, TrashIcon } from '@sanity/icons';
import imageUrlBuilder from '@sanity/image-url';

type GalleryItem = {
  _key: string;
  asset?: { _ref?: string };
  caption?: string;
};

/** Sanity-style 12-char random key for new array members. */
function randomKey(length = 12) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/**
 * Custom input for the project `gallery` array.
 *
 * The native array uploader's file picker is single-select; only drag-and-drop
 * accepts a batch. This adds a real `<input type="file" multiple>` button that
 * uploads every chosen file and appends each as an image item, while keeping the
 * default array UI below it for reordering, captions, and deletion.
 */
export function GalleryInput(props: ArrayOfObjectsInputProps) {
  const { onChange, renderDefault } = props;
  const client = useClient({ apiVersion: '2025-01-01' });
  const builder = useMemo(() => imageUrlBuilder(client), [client]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const items = (props.value ?? []) as GalleryItem[];

  const toggle = useCallback((key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const deleteSelected = useCallback(() => {
    if (!selected.size) return;
    onChange([...selected].map((key) => unset([{ _key: key }])));
    setSelected(new Set());
    setSelecting(false);
  }, [selected, onChange]);

  const exitSelectMode = useCallback(() => {
    setSelecting(false);
    setSelected(new Set());
  }, []);

  const uploadFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
      if (!files.length) return;

      setError(null);
      setProgress({ done: 0, total: files.length });

      // Upload all files concurrently; bump the counter as each one settles.
      const results = await Promise.allSettled(
        files.map((file) =>
          client.assets
            .upload('image', file, { filename: file.name })
            .finally(() => setProgress((p) => (p ? { ...p, done: p.done + 1 } : p))),
        ),
      );

      // Append successful uploads in the original selection order, in one patch.
      const items = results
        .filter((r) => r.status === 'fulfilled')
        .map((r) => ({
          _type: 'image',
          _key: randomKey(),
          asset: { _type: 'reference', _ref: r.value._id },
        }));

      if (items.length) {
        onChange([setIfMissing([]), insert(items, 'after', [-1])]);
      }

      const failed = results.length - items.length;
      if (failed > 0) {
        setError(`${failed} of ${results.length} photo${failed > 1 ? 's' : ''} failed to upload.`);
      }

      setProgress(null);
    },
    [client, onChange],
  );

  const uploading = progress !== null;

  return (
    <Stack space={3}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files) void uploadFiles(e.target.files);
          e.target.value = '';
        }}
      />

      <Button
        icon={ImagesIcon}
        mode="ghost"
        tone="primary"
        disabled={uploading}
        text={uploading ? 'Uploading…' : 'Upload multiple photos'}
        onClick={() => inputRef.current?.click()}
      />

      {uploading && progress && (
        <Card padding={3} radius={2} tone="primary" border>
          <Stack space={3}>
            <Flex align="center" gap={3}>
              <Spinner muted />
              <Text size={1} muted>
                Uploading {progress.done}/{progress.total} photo{progress.total > 1 ? 's' : ''}…
              </Text>
            </Flex>
            <Box
              style={{
                height: 4,
                borderRadius: 2,
                overflow: 'hidden',
                background: 'var(--card-border-color)',
              }}
            >
              <Box
                style={{
                  height: '100%',
                  width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                  background: 'var(--card-focus-ring-color)',
                  transition: 'width 200ms ease',
                }}
              />
            </Box>
          </Stack>
        </Card>
      )}

      {error && (
        <Card padding={3} radius={2} tone="critical" border>
          <Text size={1}>{error}</Text>
        </Card>
      )}

      {items.length > 0 && (
        <Flex gap={2} align="center">
          <Button
            mode="ghost"
            fontSize={1}
            icon={TrashIcon}
            tone={selecting ? 'default' : 'critical'}
            text={selecting ? 'Cancel selection' : 'Select photos to delete'}
            onClick={() => (selecting ? exitSelectMode() : setSelecting(true))}
          />
        </Flex>
      )}

      {selecting && items.length > 0 && (
        <Card padding={3} radius={2} border tone="transparent">
          <Stack space={3}>
            <Flex align="center" justify="space-between" gap={2}>
              <Button
                mode="bleed"
                fontSize={1}
                text={selected.size === items.length ? 'Clear all' : 'Select all'}
                onClick={() =>
                  setSelected(
                    selected.size === items.length
                      ? new Set()
                      : new Set(items.map((i) => i._key)),
                  )
                }
              />
              <Button
                icon={TrashIcon}
                fontSize={1}
                tone="critical"
                disabled={selected.size === 0}
                text={`Delete ${selected.size} selected`}
                onClick={deleteSelected}
              />
            </Flex>

            <Grid columns={[2, 3, 4]} gap={2}>
              {items.map((item) => {
                const isSel = selected.has(item._key);
                const url = item.asset?._ref
                  ? builder.image(item).width(200).height(200).fit('crop').url()
                  : null;
                return (
                  <Card
                    key={item._key}
                    padding={1}
                    radius={2}
                    border
                    tone={isSel ? 'critical' : 'default'}
                    onClick={() => toggle(item._key)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <Box style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                      <Checkbox checked={isSel} readOnly />
                    </Box>
                    {url ? (
                      <img
                        src={url}
                        alt={item.caption ?? ''}
                        style={{
                          display: 'block',
                          width: '100%',
                          aspectRatio: '1 / 1',
                          objectFit: 'cover',
                          borderRadius: 3,
                          opacity: isSel ? 0.6 : 1,
                        }}
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        style={{ aspectRatio: '1 / 1' }}
                      >
                        <Text size={1} muted>
                          No image
                        </Text>
                      </Flex>
                    )}
                  </Card>
                );
              })}
            </Grid>
          </Stack>
        </Card>
      )}

      {renderDefault(props)}
    </Stack>
  );
}
