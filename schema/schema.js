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
const { // define mysql connectors
  Root,
  User,
  Affix,
  Stem
} = require('../connectors/mysqlDB');

const staticServerAddress = "http://lasrv01.ipfw.edu/";

const dirPrefixes = {
  typedImage: "COLRC/texts/",
  typedPdf: "COLRC/texts/",
  metaDataTyped: "COLRC/texts/metadata/",
  handImage: "COLRC/texts/",
  handPdf: "COLRC/texts/",
  metaDataHand: "COLRC/texts/metadata/",
  pubEnglImage: "COLRC/texts/",
  pubEnglPdf: "COLRC/texts/",
  audio: "audio/"
};

const RootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    id: { type: GraphQLID },
    root: { type: GraphQLString },
    number: { type: GraphQLInt },
    salish: { type: GraphQLString },
    nicodemus: { type: GraphQLString },
    english: { type: GraphQLString }
    // user: {
    //   type: UserType,
    //   resolve(parent, args) {
    //     return _.find(users, { id: parent.userId });
    //   }
    // }
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
    // roots: {
    //   type: new GraphQLList(RootType),
    //   resolve(parent, args) {
    //     return _.filter(roots, { userId: parent.id });
    //   }
    // }
  })
});

const AffixType = new GraphQLObjectType({
  name: 'Affix',
  fields: () => ({
    id: { type: GraphQLID },
    type: { type: GraphQLString },
    salish: { type: GraphQLString },
    nicodemus: { type: GraphQLString },
    english: { type: GraphQLString },
    link: { type: GraphQLString },
    page: { type: GraphQLString }
  })
});


const StemType = new GraphQLObjectType({
	name: 'Stem',
	fields: () => ({
		id: { type: GraphQLID },
		category: { type: GraphQLString },
		reichard: { type: GraphQLString },
		doak: { type: GraphQLString },
		salish: { type: GraphQLString },
		nicodemus: { type: GraphQLString },
		english: { type: GraphQLString },
		note: { type: GraphQLString },
	})
});

const BaseQuery = new GraphQLObjectType({
  name: 'BaseQueryType',
  fields: {
    root: {
      type: RootType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
      	return Root.findOne({ where: { id: args.id } });
      }
    },
    user: {
      type: UserType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        return User.findOne({ where: { id: args.id } });
      }
    },
    affix: {
      type: AffixType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        return Affix.findOne({ where: { id: args.id } });
      }
    },
    stem: {
      type: StemType,
      args: { id: {type: GraphQLID } },
      resolve(parent, args) {
        return Stem.findOne({ where: { id: args.id } });
      }
    },
    roots: {
      type: new GraphQLList(RootType),
      resolve(parent, args) {
        return Root.findAll({});
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.findAll({});
      }
    },
    affixes: {
      type: new GraphQLList(AffixType),
      resolve(parent, args) {
        return Affix.findAll({});
      }
    },
    stems: {
      type: new GraphQLList(StemType),
      resolve(parent, args) {
        return Stem.findAll({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addStem: {
			type:  StemType,
			args: {
				category: { type: new GraphQLNonNull(GraphQLString) },
				reichard: { type: new GraphQLNonNull(GraphQLString) },
				doak: { type: new GraphQLNonNull(GraphQLString) },
				salish: { type: new GraphQLNonNull(GraphQLString)},
				nicodemus: { type: new GraphQLNonNull(GraphQLString)},
				english: { type: new GraphQLNonNull(GraphQLString)},
				note: { type: new GraphQLNonNull(GraphQLString)}
			},
			resolve(parent,args){
				let stem = new Stem({
					category: args.category,
					reichard: args.reichard,
					doak: args.doak,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english,
					note: args.note
				});
				return stem.save();
			}
		},
    deleteStem: {
      type: StemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent,args) {
        return Stem.destroy({ where: { id: args.id } });
      }
    },
    updateStem: {
      type: StemType,
      args: {
	  	id: { type: new GraphQLNonNull(GraphQLID) },
		category: { type: new GraphQLNonNull(GraphQLString) },
		reichard: { type: new GraphQLNonNull(GraphQLString) },
		doak: { type: new GraphQLNonNull(GraphQLString) },
		salish: { type: new GraphQLNonNull(GraphQLString)},
		nicodemus: { type: new GraphQLNonNull(GraphQLString)},
		english: { type: new GraphQLNonNull(GraphQLString)},
		note: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args) {
        return Stem.update(
          { category: args.category,
			reichard: args.reichard,
			doak: args.doak,
			salish: args.salish,
			nicodemus: args.nicodemus,
			english: args.english,
			note: args.note
          },
          {returning: true, where: {id: args.id} }
        );
        // .then(function([ rowsUpdated, [updatedRoot] ]) {
        //   return(updatedRoot);
        // });
      }
    },
		addAffix: {
			type:  AffixType,
			args: {
				type: { type: new GraphQLNonNull(GraphQLString) },
				salish: { type: new GraphQLNonNull(GraphQLString)},
				nicodemus: { type: new GraphQLNonNull(GraphQLString)},
				english: { type: new GraphQLNonNull(GraphQLString)},
				link: { type: new GraphQLNonNull(GraphQLString)},
				page: { type: new GraphQLNonNull(GraphQLString)},
			},
			resolve(parent,args){
				let affix = new Affix({
					type: args.type,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english,
					link: args.link,
					page: args.page
				});
				return affix.save();
			}
		},
    deleteAffix: {
      type: AffixType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent,args) {
        return Affix.destroy({ where: { id: args.id } });
      }
    },
    updateAffix: {
      type: AffixType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        salish: { type: new GraphQLNonNull(GraphQLString)},
        nicodemus: { type: new GraphQLNonNull(GraphQLString)},
        english: { type: new GraphQLNonNull(GraphQLString)},
        link: { type: new GraphQLNonNull(GraphQLString)},
        page: { type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parent,args) {
        return Affix.update(
          { type: args.type,
            salish: args.salish,
            nicodemus: args.nicodemus,
            english: args.english,
            link: args.link,
            page: args.page
          },
          {returning: true, where: {id: args.id} }
        );
        // .then(function([ rowsUpdated, [updatedRoot] ]) {
        //   return(updatedRoot);
        // });
      }
    },
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
    deleteRoot: {
      type: RootType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent,args) {
        return Root.destroy({ where: { id: args.id } });
      }
    },
    updateRoot: {
      type: RootType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        root: { type: new GraphQLNonNull(GraphQLString) },
        number: { type: new GraphQLNonNull(GraphQLInt) },
        salish: { type: new GraphQLNonNull(GraphQLString)},
        nicodemus: { type: new GraphQLNonNull(GraphQLString)},
        english: { type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent,args) {
        return Root.update(
          { root: args.root,
            number: args.number,
            salish: args.salish,
            nicodemus: args.nicodemus,
            english: args.english
          },
          {returning: true, where: {id: args.id} }
        );
        // .then(function([ rowsUpdated, [updatedRoot] ]) {
        //   return(updatedRoot);
        // });
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
});

module.exports = new GraphQLSchema({
  query: BaseQuery,
  mutation: Mutation
});
