// GROQ queries used by the hooks once Sanity is wired up. Kept here so
// the swap from dummy data → live data is a one-line change per hook.

export const HOMEPAGE_QUERY = /* groq */ `
  {
    "hero": *[_type == "hero"][0]{ heading, subheading, image, ctaLabel, ctaHref },
    "featured": *[_type == "project" && featured == true] | order(order asc)[0...6]{
      _id, title, "slug": slug.current, year, location, coverImage,
      "category": category->{ title, "slug": slug.current }
    },
    "company": *[_type == "company"][0]
  }
`;

export const PROJECTS_QUERY = /* groq */ `
  *[_type == "project" && ($category == null || category->slug.current == $category)]
  | order(order asc, year desc){
    _id, title, "slug": slug.current, year, location, coverImage,
    "category": category->{ title, "slug": slug.current }
  }
`;

export const PROJECT_DETAIL_QUERY = /* groq */ `
  *[_type == "project" && slug.current == $slug][0]{
    ..., "slug": slug.current,
    "category": category->{ title, "slug": slug.current },
    "related": *[_type == "project" && _id != ^._id && category._ref == ^.category._ref][0...3]{
      _id, title, "slug": slug.current, coverImage,
      "category": category->{ title, "slug": slug.current }
    }
  }
`;

export const COMPANY_QUERY = /* groq */ `*[_type == "company"][0]`;
export const HERO_QUERY = /* groq */ `*[_type == "hero"][0]`;
export const CATEGORIES_QUERY = /* groq */ `
  *[_type == "projectCategory"] | order(title asc){
    _id, title, "slug": slug.current, description
  }
`;
export const TEAM_QUERY = /* groq */ `
  *[_type == "teamMember"] | order(order asc){ _id, name, role, photo, bio, order }
`;
