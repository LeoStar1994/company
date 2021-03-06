import enquireJs from "enquire.js";

export function isDef(v) {
  return v !== undefined && v !== null;
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}

/**
 * @description: check val is empty.
 * @param : val{any}
 * @return {boolean}
 * @author: Leo
 */
export function isEmpty(val) {
  // null or undefined
  if (val == null) return true;

  if (typeof val === "boolean") return false;

  if (typeof val === "number") return !val;

  if (val instanceof Error) return val.message === "";

  switch (Object.prototype.toString.call(val)) {
    // String or Array
    case "[object String]":
    case "[object Array]":
      return !val.length;

    // Map or Set or File
    case "[object File]":
    case "[object Map]":
    case "[object Set]": {
      return !val.size;
    }
    // Plain Object
    case "[object Object]": {
      return !Object.keys(val).length;
    }
  }

  return false;
}

/**
 * @description: download file.
 * @param : data{string}
 * @param : fileName{string}
 * @return {null}
 * @author: Leo
 */
export function downloadFile(data, fileName) {
  // const fileFinallyName = decodeURI(fileName);
  // console.log(fileFinallyName);
  if (!data) {
    return;
  }
  let BLOB = new Blob([data]);
  let url = window.URL.createObjectURL(BLOB);
  let link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.download = `${fileName}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * @description: check val is right phoneNumber.
 * @param : val{string}
 * @return {boolean}
 * @author: Leo
 */
export function isRihgtPhone(val) {
  const phoneExp = /^1\d{10}$/;
  return phoneExp.test(val);
}

export function isRegExp(v) {
  return _toString.call(v) === "[object RegExp]";
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export function enquireScreen(call) {
  const handler = {
    match: function() {
      call && call(true);
    },
    unmatch: function() {
      call && call(false);
    }
  };
  enquireJs.register("only screen and (max-width: 767.99px)", handler);
}

const _toString = Object.prototype.toString;
