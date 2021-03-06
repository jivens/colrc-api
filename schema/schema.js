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
  Stem,
  sequelize
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
    english: { type: GraphQLString },
    active: { type: GraphQLString },
    prevId: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findOne({ where: { id: parent.userId } });
      }
    }
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
    page: { type: GraphQLString },
    active: { type: GraphQLString },
    prevId: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findOne({ where: { id: parent.userId } });
      }
    }
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
    active: { type: GraphQLString },
    prevId: { type: GraphQLInt },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findOne({ where: { id: parent.userId } });
      }
    }
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
        //return Root.findAll({ limit: 100 });
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
        note: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
			resolve(parent,args){
				let stem = new Stem({
					category: args.category,
					reichard: args.reichard,
					doak: args.doak,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english,
          			note: args.note,
          			active: 'Y',
         			userId: args.userId
				});
				return stem.save();
			}
    },
    // deleteRoot: {
    //   type: RootType,
    //   args: {
    //     id: { type: new GraphQLNonNull(GraphQLID) }
    //   },
    //   resolve(parent,args) {
    //     return Root.update(
    //       {
    //         active: 'N'
    //       },
    //       {returning: true, where: {id: args.id} }
    //     );
    //   }
    // },
    deleteStem: {
      type: StemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent,args) {
        return
          Stem.findOne({ where: { id: args.id} })
        	.then( stem => {
        		stem.active = 'N';
  	        return stem.save();
      		})
      		.catch(err => {
      			return err;
      		});
      }
    },
    updateStem: {
      type: StemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        reichard: { type: new GraphQLNonNull(GraphQLString)},
        doak: { type: new GraphQLNonNull(GraphQLString)},
        salish: { type: new GraphQLNonNull(GraphQLString)},
		nicodemus: { type: new GraphQLNonNull(GraphQLString)},
		english: { type: new GraphQLNonNull(GraphQLString)},
        note: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent,args) {
        Stem.update(
          {
            active: 'N'
          },
          {returning: true, where: {id: args.id}
          }
        );
        let stem = new Stem({
            category: args.category,
            reichard: args.reichard,
            doak: args.doke,
            salish: args.salish,
            nicodemus: args.nicodemus,
            english: args.english,
            note: args.note,
            active: 'Y',
            prevId: args.id,
            userId: args.userId
          });
          return stem.save();
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
				userId: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent,args){
				let affix = new Affix({
					type: args.type,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english,
					link: args.link,
					page: args.page,
					active: 'Y',
					userId: args.userId
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
      	return Affix.findOne({ where: { id: args.id} })
      	.then( affix => {
      		affix.active = 'N';
	        return affix.save();
		})
		.catch(err => {
			return err;
		});
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
        userId: { type: new GraphQLNonNull(GraphQLInt)},
      },
      resolve(parent,args) {
        sequelize.transaction(t => {

          return Affix.findOne(
            {
              where: { id: args.id},
              lock: t.LOCK.UPDATE,
              transaction: t
            }
          )
          .then( affix => {
            // Found an affix, now 'delete' it
            affix.active = 'N';
            return affix.save({transaction: t});
          })
          .then( affix => {
            // 'deleted' the old affix, now add the new affix
            let newAffix = new Affix({
              	type: args.type,
                salish: args.salish,
                nicodemus: args.nicodemus,
                english: args.english,
                link: args.link,
                page: args.page,
       	        active: 'Y',
    			      prevId: args.id,
    			      userId: args.userId
    		    });
    			  return newAffix.save({transaction: t});
          })
          .catch(err => {
            return err;
          });
        });
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
        		userId: { type: new GraphQLNonNull(GraphQLInt) }
				},
			resolve(parent,args){
				let root = new Root({
					root: args.root,
					number: args.number,
					salish: args.salish,
					nicodemus: args.nicodemus,
					english: args.english,
			        active: 'Y',
			        userId: args.userId
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
      	return Root.findOne({ where: { id: args.id} })
      	.then( root => {
      		root.active = 'N';
	        return root.save();
    		})
    		.catch(err => {
    			return err;
    		});
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
        english: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent,args) {
        Root.update(
          {
            active: 'N'
          },
          {returning: true, where: {id: args.id} }
        );
        let root = new Root({
          root: args.root,
          number: args.number,
          salish: args.salish,
          nicodemus: args.nicodemus,
          english: args.english,
          active: 'Y',
          prevId: args.id,
          userId: args.userId
        });
        return root.save();
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
