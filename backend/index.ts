// backend/index.ts
import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

router.get("/health", (ctx) => {
  ctx.body = { status: "ok" };
});

app.use(router.routes());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
