const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLSchema } = graphql;
const _ = require("lodash");

//dummy data
var roots = [
  {
    id: '1',
    root: '√a',
    number: '1',
    salish: "a",
    nicodemus: "a",
    english: "† hello. (gr.)",
  },
  {
    id: '2',
    root: '√a',
    number: '2',
    salish: 'a',
    nicodemus: 'a?',
    english: 'so. (lit. Is that so?), (adv.)',
  },
  {
    id: '3',
    root: '√a',
    number: '3',
    salish: "a·",
    nicodemus: "aaaa...!",
    english: "cut out, knock off!, quit, stop. (lit. Cut it out!, Knock it off, quit it, Stop it!), (imper.)",
  },
  {
    id: '4',
    root: '√a',
    number: '4',
    salish: "aye",
    nicodemus: "aye",
    english: "hey. (adv.)",
  },
  {
    id: '5',
    root: '√bc',
    number: '1',
    salish: "buc",
    nicodemus: "buts",
    english: "† boots. (n.)",
  },
  {
    id: '6',
    root: '√bc',
    number: '2',
    salish: "ec+búc+buc=šn",
    nicodemus: "etsbutsbutsshn",
    english: "// boots (to be wearing...). ((lit. He is wearing boots), n.)",
  },
  {
    id: '7',
    root: '√bc',
    number: '3',
    salish: "s+búc+buc=šn",
    nicodemus: "sbutsbutsshn",
    english: "boot. ((lit. a borrowed root), n.)",
  },
  {
    id: '8',
    root: '√bc',
    number: '4',
    salish: "s+búc+buc=šn+mš",
    nicodemus: "sbutsbutsshnmsh",
    english: "rubber boots (putting on...). (vt, pl.n.)",
  },
  {
    id: '9',
    root: '√bl',
    number: '1',
    salish: "bu·lí",
    nicodemus: "buuli",
    english: "† bull. (n.)",
  },
  {
    id: '10',
    root: '√bm 1',
    number: '1',
    salish: "bam",
    nicodemus: "bam",
    english: "† go (...fast and far), speeded (be...), be versatile. ((stem), vi.)",
  },
  {
    id: '11',
    root: '√bm 1',
    number: '2',
    salish: "bam",
    nicodemus: "bam",
    english: "intoxicated. ((stem), vi.)",
  },
  {
    id: '12',
    root: '√bm 1',
    number: '7',
    salish: "niʔ+b[a]m+p=aw'es",
    nicodemus: "ni'bmpa'wes",
    english: "// orgy. ((lit. there is speeding or intoxication among them), n.)",
  },
  {
    id: '13',
    root: "√dlq'ʷ",
    number: '7',
    salish: "tiʔxʷ+eɫ+n+dol+dolq'ʷ+t=íl'š+n",
    nicodemus: "ti'khweɫndoldolq'wti'lshn",
    english: "confirmed. ((lit. He gained strength, he received the rite of confirmation), vi.)",
  }
];

const RootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    id: { type: GraphQLString },
    root: { type: GraphQLString },
    number: { type: GraphQLString },
    salish: { type: GraphQLString },
    nicodemus: { type: GraphQLString },
    english: { type: GraphQLString }
    })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    root: {
      type: RootType,
      args: {id: { type: GraphQLString }},
      resolve(parent, args) {
        // code to get data from the db
        return _.find(roots, { id: args.id });
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
