<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Köszönjük a feliratkozást!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }

        .header {
            background-color: #4a6f8a;
            color: white;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 20px;
        }

        .footer {
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
        }

        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin: 15px 0;
            background-color: #4a6f8a;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Köszönjük a feliratkozást!</h1>
    </div>

    <div class="content">
        <p>Tisztelt Feliratkozó!</p>

        <p>Örömmel értesítjük, hogy sikeresen feliratkozott hírlevelünkre! Mostantól rendszeresen küldünk Önnek:</p>

        <ul>
            <li>Hasznos tippeket gyógynövényekről</li>
            <li>Új termékekről értesítéseket</li>
            <li>Akciós ajánlatokat</li>
            <li>Szezonális gyógynövény tanácsokat</li>
        </ul>

        <p>Ha bármikor szeretne leiratkozni, kattintson az alábbi gombra:</p>

        <a href="{{ url('/newsletter/unsubscribe/' . $subscriber->token) }}" class="btn">Leiratkozás</a>

        <p>Üdvözlettel,<br>
            A Gyógynövény Webshop csapata</p>
    </div>

    <div class="footer">
        <p>Ezt az emailt azért kapta, mert feliratkozott hírlevelünkre.</p>
        <p>© {{ date('Y') }} Gyógynövény Webshop - Minden jog fenntartva.</p>
    </div>
</body>

</html>