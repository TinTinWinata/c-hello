export function getWebId()
{
  var url = window.location.href
  var id = url.substring(url.lastIndexOf('/') + 1);
  return id
}