import _ from 'lodash';

export default function (input, structure) {
  const inputData = input;
  const dataArr = [];
  const objArr = [];
  const objArrMap = new Map();
  const map = [];
  structure.forEach((p) => {
    const prop = p;
    let str = '';
    if (prop.tableView !== false) {
      prop.key.forEach((key) => {
        if (typeof key === 'string') {
          if (str !== '') {
            str = `${str}.${key}`;
          } else {
            str = key;
          }
        }
      });
      map.push(str);
      objArrMap.set(str, {
        label: prop.name,
        key: str,
        numeric: prop.type === 'number',
        disablePadding: prop.options && prop.tableOptions.indexOf('disablePadding') > -1,
        tableFunc: prop.tableFunc,
      });
    }
  });
  inputData.forEach((item) => {
    const obj = {};
    const values = _.at(item, map);
    dataArr.push(values);
    map.forEach((prop, i) => {
      obj[prop] = values[i];
    });
    objArr.push(obj);
  });
  return {
    dataArr,
    objArr,
    objArrMap,
  };
}
