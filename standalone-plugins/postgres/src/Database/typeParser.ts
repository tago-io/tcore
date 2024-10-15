import { types } from "pg";

const int8Parser = (val) => parseInt(val, 10);

types.setTypeParser(types.builtins.INT8, int8Parser);
