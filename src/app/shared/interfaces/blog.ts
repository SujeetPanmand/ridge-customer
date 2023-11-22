export interface BlogsDetails {
  allBlogsDetailsList?: AllBlogsDetailsList[];
  statusCode?: number;
  message?: string;
  createdAt?:Date;
}

export interface AllBlogsDetailsList {
createdAt: any;
  id?: string;
  title?: string;
  tagId?: string;
  tag?:TagDetail;
  author?: string;
  content?: string;
  isActive?: boolean;
}

export interface TagDetail {
  blogTag?:string;
  createdAt?:Date;
  id?:string;
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
  createdAt?:Date;
  blog?: null;
  message?: string;
  replies?: Reply[];
}

export interface Reply {
  id?: string;
  message?: string;
  replier?: User;
  createdAt?:Date;
}

export interface User {
  id?: string;
  name?: string;
}
