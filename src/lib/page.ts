import config from "../configs/config.ts";

export const pageHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Форма для переноса домена</title>
    <style> 
    body { 
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
        display: flex;
        flex-direction: column;
        }
        form {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 300px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #333;
        }
        input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            width: 100%;
            padding: 10px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #2980b9;
        }
        .spinner {
            display: none;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 2s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
<div class='container'>
    <form id="domainForm">
        <label for="domain">Имя домена (обязательно):</label><br>
        <input type="text" id="domain" name="domain" required><br>
        <label for="accountId">ID аккаунта (опционально, по умолчанию: ${config.DEFAULT_ACCOUNT_ID}, ${config.DEFAULT_ACCOUNT_NAME}):</label><br>
        <input type="text" id="accountId" name="accountId" value="${config.DEFAULT_ACCOUNT_ID}"><br>
        <button type="submit">Отправить</button>
    </form>
    <div class="spinner" id="spinner"></div>
    </div>
    <script>
    document.getElementById('domainForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    // Получаем значения полей
    const domain = document.getElementById('domain').value;
    const accountId = document.getElementById('accountId').value || null; // Если пусто, отправляем null

    // Отключаем элементы формы
    const formElements = document.getElementById('domainForm').elements;
    for (let element of formElements) {
        element.disabled = true;
    }

    // Показываем спиннер
    document.getElementById('spinner').style.display = 'block';

    try {
        // Отправляем POST-запрос на сервер
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ domain, accountId })
        });

        if (!response.ok) {
            throw new Error('Ошибка при отправке запроса');
        }

        const data = await response.json();
        console.log('Успешный ответ:', data);
        alert(data.message); 
        // Здесь можно добавить обработку ответа, например, alert(data.message);
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Произошла ошибка при отправке данных');
    } finally {
        // Включаем форму обратно
        for (let element of formElements) {
            element.disabled = false;
        }
        // Скрываем спиннер
        document.getElementById('spinner').style.display = 'none';
    }
});
</script>
</body>
</html>`;