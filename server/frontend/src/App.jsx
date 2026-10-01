import { useState, useEffect } from "react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import cpp from 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import "./index.css"

function App()
{
	const [selectedCode, setSelectedCode] = useState(null);
	const [submissions, setSubmissions] = useState([]);
	useEffect(() =>
	{
		fetch("api/submissions").then(res => res.json()).then(data => setSubmissions(data)) // 收到响应后解析 json 然后传递给 data
	}, []) // 只执行一次
	return (
		<div className="min-h-screen p-8" style={{ background: 'linear-gradient(to right, #07121f, #0e2336)' }}>
			<div className="max-w-6xl mx-auto">
				<h1 className="text-3xl font-bold text-sky-400 mb-8">CP Compass Dashboard</h1>

				<div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
					<table className="w-full text-left">
						<thead className="text-sky-200 bg-transparent border-white/10 border-b">
							<tr>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">来源</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">提交编号</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">题目</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">分数</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">状态</th>
								<th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider">提交时间</th>
							</tr>
						</thead>
						<tbody>
							{submissions.map((item) => (
								<tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
									onClick={() => setSelectedCode(item.code)}>
									{/*当用户点击这一行时，把这一条的代码字符串存入状态，触发重新渲染*/}
									<td className="px-6 py-4 text-white font-medium">{item.source}</td>
									<td className="px-6 py-4 text-white font-medium">{item.submissionId.substring(2)}</td>
									<td className="px-6 py-4 text-sm text-gray-500">{item.problemId}</td>
									<td className="px-6 py-4 text-sm font-bold" style={{ color: `hsl(${item.score * 1.2}, 80%, 60%)` }}>{item.score}</td>
									<td className={`px-6 py-4 text-sm font-bold ${item.verdict === "Accepted" ? "text-green-400" : "text-red-400"}`}>
										{item.verdict}
									</td>
									<td className="px-6 py-4 text-sm text-gray-500">{item.submissionTime}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			{
				selectedCode &&
				(
					<div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCode(null)}>
						{/* 点击遮罩层关闭弹窗 */}
						<div className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
							{/* stopPropagation 阻止冒泡，这样点击弹窗内部不会关闭弹窗 */}
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-bold text-white">源代码</h2>
								<button className="text-gray-400 hover:text-white" onClick={() => setSelectedCode(null)}>关闭</button>
							</div>
							<div className="flex-1 min-h-0 overflow-auto">
								<SyntaxHighlighter
									language="cpp"
									style={vscDarkPlus}
									showLineNumbers={true}
									customStyle={{ margin: 0, background: 'transparent', fontSize: '14px' }}
								>
									{selectedCode}
								</SyntaxHighlighter>
							</div>
						</div>
					</div>
				)
			}
		</div>
	);
}

export default App;