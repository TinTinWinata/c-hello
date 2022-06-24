export function getWebId() {
  var url = window.location.href;
  var id = url.substring(url.lastIndexOf("/") + 1);
  return id;
}

export function removeArray(arr, value) {
  return arr.filter(function (val) {
    return val != value;
  });
}

export function removeArrayByIndex(arr, index) {
  arr.splice(index, 1);
}

export function arrayIsEqual(array1, array2) {
  return array1.join() == array2.join();
}
