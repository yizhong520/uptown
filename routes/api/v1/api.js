import express from 'express';
var router = express.Router();

import postsRouter from './controllers/posts.js';
import usersRouter from './controllers/users.js';
import commentsRouter from './controllers/comments.js';

router.use('/posts', postsRouter);
router.use('/users', usersRouter);
router.use('/comments', commentsRouter);

export default router;