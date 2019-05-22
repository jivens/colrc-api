const graphql = require('graphql');
const { 
	GraphQLObjectType, 
	GraphQLString, 
	GraphQLSchema, 
	GraphQLID, 
	GraphQLInt,
	GraphQLList,
	GraphQLNonNull
	} = graphql;
//const _ = require('lodash'); 
const {
	Root,
	User
} = require('../connectors/mysqlDB');

const RootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    id: { type: GraphQLID },
    root: { type: GraphQLString },
    number: { type: GraphQLInt },
    salish: { type: GraphQLString },
    nicodemus: { type: GraphQLString },
    english: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    first: { type: GraphQLString },
    last: { type: GraphQLString },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    roles: { type: GraphQLString }
    })
});

const BaseQuery = new GraphQLObjectType({
  name: 'BaseQueryType',
  fields: {
    root: {
      type: RootType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        console.log(typeof(args.id));
        return Root.findOne ({ where: {id: args.id} });
      }
    },
    user: {
      type: UserType,
      args: { id: {type: GraphQLID} },
      resolve(parent, args) {
    	return User.findOne ({ where: {id: args.id} });
      }
    },
    roots: {
    	type: new GraphQLList(RootType),
    	resolve(parent, args) {
			//return roots;
			return Root.findAll({});
    	}
    },
    users: {
		type: new GraphQLList(UserType),
		resolve(parent, args) {
			//return users;
			return User.findAll({});
		}
    }
  }
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addRoot: {
			type:  RootType,
			args: {
				root: { type: new GraphQLNonNull(GraphQLString) },
				number: { type: new GraphQLNonNull(GraphQLInt) },
				salish: { type: new GraphQLNonNull(GraphQLString)},
				nicodemus: { type: new GraphQLNonNull(GraphQLString)},
				english: { type: new GraphQLNonNull(GraphQLString)},
			},
			resolve(parent,args){
				let root = new Root({
					root: args.root,
					number: args.number,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english
				});
				return root.save();
			}
		},
		addUser: {
			type: UserType,
			args: {
				first: { type: new GraphQLNonNull(GraphQLString) },
				last: { type: new GraphQLNonNull(GraphQLString) },
				username: { type: new GraphQLNonNull(GraphQLString) },
				email: { type: new GraphQLNonNull(GraphQLString) },
				password: { type: new GraphQLNonNull(GraphQLString) },
				roles: { type: new GraphQLNonNull(GraphQLString) }
				},
			resolve(parent,args){
				let user = new User ({
					first: args.first,
					last: args.last,
					username: args.username,
					email: args.email,
					password: args.password,
					roles: args.roles
				});
				return user.save();
			}
		}
	}
})
module.exports = new GraphQLSchema({
  query: BaseQuery,
  mutation: Mutation
});