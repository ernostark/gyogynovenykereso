<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $success ? 'Sikeres leiratkozás' : 'Hiba a leiratkozás során' }}</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header bg-{{ $success ? 'success' : 'danger' }} text-white">
                        <h4 class="mb-0">{{ $success ? 'Sikeres leiratkozás' : 'Hiba történt' }}</h4>
                    </div>
                    <div class="card-body">
                        <p class="card-text">{{ $message }}</p>
                        
                        @if($success)
                            <p>Sajnáljuk, hogy távozol. Ha meggondolnád magad, bármikor újra feliratkozhatsz a weboldal láblécében.</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>