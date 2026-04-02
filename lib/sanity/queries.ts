export const homePageQuery = '*[_type == "artwork"][0...3]';
export const galleryQuery = '*[_type == "artwork"]';
export const artworkDetailQuery = '*[_type == "artwork" && slug.current == $slug][0]';
