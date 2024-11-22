function name1(params = {name: '123', age: 18}) {
  console.log(JSON.stringify(params, null, 2));
}
name1()