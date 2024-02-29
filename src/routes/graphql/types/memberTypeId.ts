import { GraphQLScalarType, Kind } from 'graphql';

type MemberTypeValue = 'basic' | 'business';

export const MemberTypeIdType = new GraphQLScalarType({
  name: 'MemberTypeId',
  serialize(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId (failed to serialize)`);
    }
    return value;
  },
  parseValue(value) {
    if (!isMemberTypeId(value)) {
      throw new TypeError(`Invalid MemberTypeId (failed to parse)`);
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
