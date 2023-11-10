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

export interface Comment {
  commentList?: CommentList[];
  statusCode?: number;
  message?: string;
}

export interface CommentList {
  id?: string;
  user?: User;
  blogId?: string;
  blog?: null;
  message?: string;
  replies?: Reply[];
}

export interface Reply {
  id?: string;
  message?: string;
  replier?: User;
}

export interface User {
  id?: string;
  name?: string;
}
