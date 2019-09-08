/**
 * Helper functions that when passed a request will return a
 * boolean indicating if the request uses that HTTP method,
 * header, host or referrer.
 */
import { match } from "path-to-regexp";

const Method = method => req =>
  req.method.toLowerCase() === method.toLowerCase();
const Connect = Method("connect");
const Delete = Method("delete");
const Get = Method("get");
const Head = Method("head");
const Options = Method("options");
const Patch = Method("patch");
const Post = Method("post");
const Put = Method("put");
const Trace = Method("trace");

const Header = (header, val) => req => req.headers.get(header) === val;
const Host = host => Header("host", host.toLowerCase());
const Referrer = host => Header("referrer", host.toLowerCase());

const Path = regExp => req => {
  const url = new URL(req.url);
  const path = url.pathname;
  const match = path.match(regExp) || [];
  return match[0] === path;
};

/**
 * The Router handles determines which handler is matched given the
 * conditions present for each request.
 */
class Router {
  constructor() {
    this.routes = [];
  }

  handle(conditions, regexp, handler) {
    const matcher = match(regexp);
    this.routes.push({
      conditions,
      handler,
      matcher
    });
    return this;
  }

  connect(url, handler) {
    return this.handle([Connect], url, handler);
  }

  delete(url, handler) {
    return this.handle([Delete], url, handler);
  }

  get(url, handler) {
    return this.handle([Get], url, handler);
  }

  head(url, handler) {
    return this.handle([Head], url, handler);
  }

  options(url, handler) {
    return this.handle([Options], url, handler);
  }

  patch(url, handler) {
    return this.handle([Patch], url, handler);
  }

  post(url, handler) {
    return this.handle([Post], url, handler);
  }

  put(url, handler) {
    return this.handle([Put], url, handler);
  }

  trace(url, handler) {
    return this.handle([Trace], url, handler);
  }

  all(handler) {
    return this.handle([], handler);
  }

  route(req) {
    const route = this.resolve(req);

    if (route) {
      const { pathname } = new URL(req.url);
      const matched = route.matcher(pathname);
      req.params = matched.params;
      return route.handler(req);
    }

    return new Response("resource not found", {
      status: 404,
      statusText: "not found",
      headers: {
        "content-type": "text/plain"
      }
    });
  }

  /**
   * resolve returns the matching route for a request that returns
   * true for all conditions (if any).
   */
  resolve(req) {
    return this.routes.find(r => {
      if (!r.conditions.every(c => c(req))) {
        return false;
      }

      const { pathname } = new URL(req.url);
      const matched = r.matcher(pathname);
      if (!matched) {
        return false;
      }
      return true;
    });
  }
}

module.exports = Router;
