import Api from "./src/api.ts";

const api=new Api;

await api.setName();
await api.createApp();


