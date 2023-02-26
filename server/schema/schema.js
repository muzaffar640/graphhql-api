const graphql = require("graphql");
const _ = require("lodash");
const User = require("../model/user");
const Post = require("../model/post");
const Hobby = require("../model/hobby");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

//Create types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Documentation for user..",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new GraphQLObjectType({
  name: "Hobby",
  description: "Users Hobby",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ id: args.id });
      },
    },
  }),
});

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "Users post",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.find({ id: args.id });
      },
    },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Hobby.findById(args.id);
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        return Hobby.find({});
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Post.findById(args.id);
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        return Post.find({ id: args.userId });
      },
    },
  },
});

//Mutation

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    CreateUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        let user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    //UPDATE User
    UpdateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        ));
      },
    },

    //Remove User

    RomoveUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();
        if (!removedUser) {
          throw new Error();
        }
        return removedUser;
      },
    },

    //Create Post

    CreatePost: {
      type: PostType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    // Updated Post
    UpdatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        return (updatePost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
              userId: args.userId,
            },
          },
          { new: true }
        ));
      },
    },

    //Remove Post

    RemovePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let deletedPost = Post.findByIdAndRemove(args.id).exec();

        if (!deletedPost) {
          return new Error();
        }
        return deletedPost;
      },
    },

    //Create Hobby

    CreateHobby: {
      type: HobbyType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },

    //Update Hobby
    UpdateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return (updateHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
              userId: args.userId,
            },
          },
          { new: true }
        ));
      },
    },

    //Remove Hobby

    RemoveHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!removedHobby) {
          return new Error();
        }
        return removedHobby;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
