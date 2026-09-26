chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) =>
{
	console.log("Received message:", message);
	const result = await chrome.storage.local.get(['apiToken']);
	fetch("http://127.0.0.1:8787/submit",
		{
			method: "POST",
			headers:
			{
				"Content-Type": "application/json",
				"X-CP-Compass-API-Token": result.apiToken // 添加自定义头部
			},
			body: JSON.stringify(message) // 发送JSON数据
		})
});