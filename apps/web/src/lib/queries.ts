// GROQ queries used by the hooks once Sanity is wired up. Kept here so
// the swap from dummy data → live data is a one-line change per hook.

// Sanity stores images as a reference ({ _type, asset: { _ref } }), not a URL.
// These fragments dereference the asset and project the { url, alt } shape the
// app's ProjectImage type expects. `?auto=format` lets the CDN serve WebP where
// supported without pinning a width (cover images are reused at several sizes).
const IMAGE = `{ "url": asset->url + "?auto=format", "alt": alt }`;
const GALLERY_IMAGE = `{ "url": asset->url + "?auto=format", "alt": alt, caption }`;

// A project is only shown on the website when it has a cover image. This mirrors
// the Studio rule (coverImage is required, so a project with no cover can't be
// published and stays a draft) and guards the site even if that's bypassed.
const HAS_COVER = `defined(coverImage.asset)`;

export const HOMEPAGE_QUERY = /* groq */ `
  {
    "hero": *[_type == "hero"][0]{ heading, subheading, "image": image${IMAGE}, ctaLabel, ctaHref },
    "featured": *[_type == "project" && featured == true && ${HAS_COVER}] | order(order asc)[0...6]{
      _id, title, "slug": slug.current, year, location, "coverImage": coverImage${IMAGE},
      "category": category->{ title, "slug": slug.current }
    },
    "company": *[_type == "company"][0]
  }
`;

export const PROJECTS_QUERY = /* groq */ `
  *[_type == "project" && ${HAS_COVER} && ($category == null || category->slug.current == $category)]
  | order(order asc, year desc){
    _id, title, "slug": slug.current, year, location, "coverImage": coverImage${IMAGE},
    "category": category->{ title, "slug": slug.current }
  }
`;

export const PROJECT_DETAIL_QUERY = /* groq */ `
  *[_type == "project" && slug.current == $slug && ${HAS_COVER}][0]{
    ..., "slug": slug.current,
    "coverImage": coverImage${IMAGE},
    "gallery": gallery[]${GALLERY_IMAGE},
    "category": category->{ title, "slug": slug.current },
    "related": *[_type == "project" && _id != ^._id && ${HAS_COVER} && category._ref == ^.category._ref][0...3]{
      _id, title, "slug": slug.current, "coverImage": coverImage${IMAGE},
      "category": category->{ title, "slug": slug.current }
    }
  }
`;

export const COMPANY_QUERY = /* groq */ `*[_type == "company"][0]`;
export const HERO_QUERY = /* groq */ `*[_type == "hero"][0]{ heading, subheading, "image": image${IMAGE}, ctaLabel, ctaHref }`;
export const CATEGORIES_QUERY = /* groq */ `
  *[_type == "projectCategory"] | order(title asc){
    _id, title, "slug": slug.current, description
  }
`;
export const TEAM_QUERY = /* groq */ `
  *[_type == "teamMember"] | order(order asc){ _id, name, role, "photo": photo${IMAGE}, bio, order }
`;
