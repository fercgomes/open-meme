import axios, { AxiosRequestConfig } from "axios";
import { AuthCookieObject } from "./types";
import Cookie from "js-cookie";
import Logger from "js-logger";
import { NoAuthCookieException } from "./exceptions";
import {
  IPost,
  IPostResponse,
  IFullPost,
  IFullPostResponse,
} from "./types/posts";
import { IComment, ICommentResponse } from "./types/comments";
import { VoteType } from "./types/common";

/** Named logger. */
const log = Logger.get("API");

const API_URL_DEV = "http://localhost:3000";

/** Which key the auth object will be stored in the cookies */
export const AUTH_COOKIE_NAME = "a";

/** Axios's base instance. */
const api = axios.create({
  baseURL: API_URL_DEV,
});

/**
 * Returns the auth cookie object.
 *
 * @throws {NoAuthCookieException} If the auth cookie is not present.
 */
export function getAuthCookie(): AuthCookieObject {
  const authCookie = Cookie.getJSON(AUTH_COOKIE_NAME);
  if (authCookie) {
    return authCookie;
  } else {
    throw new NoAuthCookieException();
  }
}

/**
 * Stores the auth cookie.
 */
export function setAuthCookie(cookie: AuthCookieObject): void {
  Cookie.set(AUTH_COOKIE_NAME, cookie, { expires: 7 });
}

/**
 * Removes the auth cookie.
 */
export function removeAuthCookie(): void {
  Cookie.remove(AUTH_COOKIE_NAME);
}

/** Whenever auth data is available in the cookies,
 *  authentication headers will be configured for
 *  every request.
 *
 * ? do I need to swich between auth required/not-required?
 */
api.interceptors.request.use(
  function (config) {
    try {
      const authCookie = getAuthCookie();

      log.info(`Appending token ${authCookie.token} to request headers.`);
      config.headers["Authorization"] = `Bearer ${authCookie.token}`;

      return config;
    } catch (err) {
      log.info(`All requests will be sent without auth.`);
      return config;
    }
  },
  function (error) {
    log.error(error);
    return Promise.reject(error);
  }
);

/** Transforms date strings to Date objects. */
function transformDates<T extends { createdAt: string }>(post: T) {
  return {
    ...post,
    createdAt: new Date(post.createdAt),
  };
}

/**
 *? Is there a more generic way of handling all this code?
 */
export const Api = {
  /** Authentcation endpoints */
  auth: {
    login: async (username: string, password: string): Promise<any> => {
      try {
        const response = await api.post("/auth/login", { username, password });
        return response.data;
      } catch (err) {
        log.error(err);
        throw err;
      }
    },
  },
  /** Post endpoints.
   *  When listing posts, the API returns a Post type.
   *  When retrieving a single post, the API returns
   *  a FullPost type.
   */
  posts: {
    /** Post querying endpoint */
    query: async (): Promise<IPost[]> => {
      try {
        const response = await api.get<IPostResponse[]>("/posts");
        return response.data.map((post) => transformDates(post));
      } catch (err) {
        log.error(err);
        throw err;
      }
    },

    /** Get full post */
    fetchFullPost: async (key: string, postId: string): Promise<IFullPost> => {
      try {
        const response = await api.get<IFullPostResponse>(`/posts/${postId}`);
        return transformDates(response.data);
      } catch (err) {
        log.error(err);
        throw err;
      }
    },

    /** TODO Create post */
    createPost: async ({ title, contentRef }: any) => {
      try {
        const response = await api.post(`/posts?ref=${contentRef}`, { title });
        return response.data;
      } catch (err) {
        throw err;
      }
    },

    /** TODO Delete post */
    deletePost: (postId: string) => {},

    /** TODO Edit post */
    editPost: () => {},

    /** TODO Vote post */
    votePost: async ({
      postId,
      vote,
    }: {
      postId: string;
      vote: VoteType;
    }): Promise<IPost> => {
      try {
        const response = await api.post<IPostResponse>(
          `/posts/${postId}/vote`,
          { type: vote }
        );
        return transformDates(response.data);
      } catch (err) {
        throw err;
      }
    },

    /** TODO Unvote post */
    unvotePost: () => {},

    /**
     * Returns the post's comments.
     * TODO pagination
     */
    getComments: async (postId: string): Promise<IComment[]> => {
      try {
        const response = await api.get<ICommentResponse[]>(
          `/posts/${postId}/comments`
        );
        return response.data.map((comment) => transformDates(comment));
      } catch (err) {
        log.error(err);
        throw err;
      }
    },

    /**
     * Creates a comment in this post.
     *
     * Author will be infered from Auth token.
     * TODO Post or FullPost?
     * ? DTO?
     */
    createPostComment: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }): Promise<IPost> => {
      try {
        const response = await api.post<IPost>(`/posts/${postId}/comments`, {
          content,
        });
        return response.data;
      } catch (err) {
        log.error(err);
        throw err;
      }
    },
  },
  /** Comments endpoints. */
  comments: {
    /** TODO */
    deletePostComment: () => {},

    /** TODO */
    editPostComment: () => {},

    /** TODO */
    votePostComment: () => {},

    /** TODO */
    unvotePostComment: () => {},
  },
  media: {
    sendImage: async (data: any, config?: AxiosRequestConfig) => {
      const response = await api.post("/media/image", data);
      return response.data;
    },
  },
};
