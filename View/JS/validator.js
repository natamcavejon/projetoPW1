(function ($) {
    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }

                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
})(jQuery);

;(function () {
    var form = $('.form-validator'),
        origin = window.location.origin  || '',
        alertMessage = form.find('.alert'),
        routes = {
            login: origin + '/projetoPW/api/login.php',
            cadastro: origin + '/projetoPW/api/cadastrarMecanico.php',
            ordemservico: origin + '/projetoPW/api/cadastarOrdemServico.php',
            credito: origin + '/admin/api/InsertCredito.php'
        };

    form.validator().on('submit', function (e) {
        alertMessage
            .removeClass('d-none alert-warning')
            .hide();

        if (e.isDefaultPrevented()) {
            alertMessage
                .addClass('alert-warning')
                .text('Prencha todos os campos!')
                .show();
        } else {
            var path = e.target.getAttribute('form-validator'),
                route = routes[path];

            switch (path) {
                case 'login':
                    formLogin(route);
                    break;
                case 'cadastro':
                    formCadastro(route);
                    break;
                case 'ordemservico':
                    formServico(route);
                    break;
                case 'credito':
                    formCredito(route);
                    break;
            }
        }

        e.preventDefault();
    });

    function formLogin (url) {
        sendForm(form, url)
            .then(function (response) {
                form.trigger('reset');
                if (!response.success) {
                    var message = response.message;

                    showAlert(message);
                } else {
                    window.location.href = origin + "/projetoPW/view/Formulario.html";
                }
            }, function (response){
                var message = response.responseJSON.message;

                showAlert(message);
            });
    }

    function formServico (url) {
        sendForm(form, url)
            .then(function (response) {
                var message = response.message;
                form.trigger('reset');

                var state = (response.success) ? 'success' : 'warning';
                showAlert(message, state);
            }, function (response){
                var message = response.responseJSON.message;

                showAlert(message);
            });
    }
    
    function formCadastro (url) {
        sendForm(form, url)
            .then(function (response) {
                var message = response.message;
                form.trigger('reset');

                var state = (response.success) ? 'success' : 'warning';
                showAlert(message, state);
            }, function (response){
                var message = response.responseJSON.message;

                showAlert(message);
            });
    }

    function formCredito (url) {
        sendForm(form, url)
            .then(function (response) {
                var message = response.message;

                form.trigger('reset');

                showAlert(message, 'success');
            }, function (response){
                var message = response.responseJSON.message || 'Erro ao inserir creditos';

                showAlert(message);
            });
    }

    function showAlert (message, state) {
        state = state || 'warning';

        alertMessage
            .addClass('alert-' + state)
            .text(message)
            .show();
    }

    function sendForm (target, url) {
        var url = url || target.attr('action'),
            type = target.attr('method') || 'GET',
            data = target.serializeFormJSON();

        return $.ajax({ type, url, data });
    }

})();
