class Store {
  async get(id) {
    const str = await KV.get(id);
    if (!str) {
      return null;
    }
    return JSON.parse(str);
  }

  async put(id, data) {
    if (typeof data !== "object" || data === null) {
      throw new Error("must pass object to put()");
    }
    await KV.put(id, JSON.stringify(data));
  }

  async list({ prefix }) {
    const res = await KV.list({ prefix });
    return res.keys.map(key => key.name);
  }
}

export default new Store();
