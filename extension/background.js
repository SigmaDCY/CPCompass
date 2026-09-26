
function dataSerialize(data)
{
	data.submissionTime = data.submissionTime.replace(" ", "T"); // ISO 8601
	data.submissionTime += "+03:00"; // UTC+3
	const time = new Date(data.submissionTime);
	const localTime = time.toLocaleString()
	data.submissionTime = localTime;
	return data;
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) =>
{
	console.log("Received message:", message);
	const result = await chrome.storage.local.get(['apiToken']);
	const serializedMessage = dataSerialize(message);
	fetch("http://127.0.0.1:8787/submit",
		{
			method: "POST",
			headers:
			{
				"Content-Type": "application/json",
				"X-CP-Compass-API-Token": result.apiToken // 添加自定义头部
			},
			body: JSON.stringify(serializedMessage) // 发送JSON数据
		})
});