import { GraphQLScalarType, Kind } from 'graphql';

type MemberTypeValue = 'basic' | 'business';

export const MemberTypeIdType = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId`);
    }
    return value;
  },
  parseValue(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeID`);
    }
    return value;
  },
  parseLiteral(valueNode) {
    if (valueNode.kind === Kind.STRING && isMemberTypeId(valueNode.value)) {
      return valueNode.value;
    }
  },
});

function isMemberTypeId(value: unknown): value is MemberTypeValue {
  return value === 'basic' || value === 'business';
}
