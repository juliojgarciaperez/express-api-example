require('dotenv').config();

const faker = require('faker');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');
const Like = require('../models/like.model');

require('../config/db.config');

mongoose.connection.once('open', async () => {
  try {
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    await Like.deleteMany({});

    const users = []

    for (let i = 0; i < 10; i++) {
      const user = await User.create({
        name: faker.name.findName(),
        avatar: faker.image.avatar(),
        username: faker.internet.userName(),
        bio: faker.lorem.sentence(),
        password: 'P4ssw0rd!#'
      })

      console.log(user.username)

      for (let j = 0; j < 10; j++) {
        const post = await Post.create({
          text: faker.lorem.sentence(),
          author: user.id,
          image: faker.image.imageUrl()
        })

        if (users.length) {
          for (let k = 0; k < 5; k++) {
            const random = Math.floor(Math.random() * users.length);
            const user = users[random];

            const like = await Like.findOne({
              post: post.id,
              user: user.id
            })

            if (like) {
              await like.delete()
            } else {
              Like.create({
                post: post.id,
                user: user.id
              })
            }

            await Comment.create({
              text: faker.lorem.sentence(),
              user: user.id,
              post: post.id
            })
          }
        }
      }

      users.push(user);
    }

    await mongoose.disconnect()
  } catch(err) {
    console.error(err)
  }
})
