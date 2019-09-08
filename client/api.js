import fetch from "isomorphic-fetch";
import { useUser } from "./user-context";
import { useMemo } from "react";

export class API {
  constructor({ user }) {
    this.user = user;
  }

  async _fetch(path, reqOptions = {}) {
    const options = {
      ...reqOptions,
      headers: reqOptions.headers || {}
    };

    if (this.user) {
      options.headers.authorization = `JWT ${this.user.token}`;
    }
    if (reqOptions.body) {
      options.body = JSON.stringify(reqOptions.body);
      options.headers["content-type"] = "application/json";
    }
    const res = await fetch(path, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error);
    }
    return data;
  }

  async createAccount(username, email, password) {
    return await this._fetch("/user", {
      method: "POST",
      body: { username, email, password }
    });
  }

  async createVid({ uid }) {
    return await this._fetch("/vid", {
      method: "POST",
      body: { uid }
    });
  }

  async getVid(id) {
    return await this._fetch(`/vids/${id}`);
  }

  async publishVid(id) {
    return await this._fetch(`/vids/${id}/publish`, { method: "POST" });
  }

  async getUserVids({ userId }) {
    return await this._fetch(`/user/${userId}/vids`);
  }

  async login(username, password) {
    return await this._fetch("/user/token", {
      method: "POST",
      body: { username, password }
    });
  }
}

export default function useApi() {
  const user = useUser();
  return useMemo(() => new API({ user }), [user]);
}
