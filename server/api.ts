import express from "express";

const router = express.Router();

router.get("/twitter", (req, res) => {
  const id = req.query.id as string | undefined;
  if (id == undefined) {
    return res.status(404).send();
  }

  res.send(id);
});

export default router;
