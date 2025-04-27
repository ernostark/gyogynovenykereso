<x-mail::message>
    {{-- Greeting --}}
    # @lang('Tisztelt Felhasználónk!')

    {{-- Intro Lines --}}
    @foreach ($introLines as $line)
        {{ $line }}

    @endforeach

    {{-- Action Button --}}
    @isset($actionText)
        <?php
        $color = match ($level) {
            'success', 'error' => $level,
            default => 'primary',
        };
            ?>
        <x-mail::button :url="$actionUrl" :color="$color">
            {{ $actionText }}
        </x-mail::button>
    @endisset

    {{-- Outro Lines --}}
    @foreach ($outroLines as $line)
        {{ $line }}

    @endforeach

    {{-- Salutation --}}
    @lang('Üdvözlettel,') <br>
    {{ config('app.name') }}

    {{-- Subcopy --}}
    @isset($actionText)
        <x-slot:subcopy>
            @lang(
                "Ha gondod van a(z) \":actionText\" gombra kattintással, másold ki és illeszd be az alábbi URL-t a böngésződbe:",
                [
                    'actionText' => $actionText,
                ]
            ) <span class="break-all">[{{ $displayableActionUrl }}]({{ $actionUrl }})</span>
        </x-slot:subcopy>
    @endisset
</x-mail::message>