const apiTokenInput = document.getElementById("apiTokenInput");
const apiTokenSave = document.getElementById("saveButton");

// 回显 API Token
async function loadSavedToken()
{
	const storedResult = await chrome.storage.local.get(['apiToken']);
	const storedApiToken = storedResult.apiToken;
	apiTokenInput.value = storedApiToken || "";
}
loadSavedToken();

apiTokenSave.addEventListener("click", async () =>
{
	// 保存 API Token
	const tokenValue = apiTokenInput.value; // 先把输入框里的文字拿出来
	await chrome.storage.local.set({ apiToken: tokenValue }); // 存成对象形式
	apiTokenSave.textContent = "已保存";
	setTimeout(() =>
	{
		apiTokenSave.textContent = "保存";
	}, 2000);
})