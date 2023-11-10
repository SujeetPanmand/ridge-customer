export interface BlogsDetails {
  allBlogsDetailsList?: AllBlogsDetailsList[];
  statusCode?: number;
  message?: string;
}

export interface AllBlogsDetailsList {
  id?: string;
  title?: string;
  tag?: string;
  author?: string;
  content?: string;
  isActive?: boolean;
}

export interface SingleBlogDetails {
  blogDetails?: AllBlogsDetailsList;
  statusCode?: number;
  message?: string;
}
