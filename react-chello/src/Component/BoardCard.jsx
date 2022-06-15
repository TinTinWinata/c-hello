

export function BoardCard(props)
{
  return(
<div className="mb-5 h-32 mr-5 w-64 rounded overflow-hidden shadow-lg cursor-pointer">
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2">{props.name}</div>
  </div>
  <div className="px-6 pt-4 pb-2">
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
  </div>
</div>
)
}