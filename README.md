# Proyecto: Mercado Libre | X-Men DNA #

Este repositorio almacena los recursos que son requeridos para la implementación de un sistema destinado a Magneto para la identificación de mutantes.

## Tecnologías ##

* [NodeJS](https://nodejs.org/es/): cluster

## Instalación ##

```console
sudo apt-get update
sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install -g eslint
sudo npm install -g jshint
sudo npm install -g jshint-esnext
```

Luego descargamos el repositorio (ruta recomendada: /var/www/xmen) y ejecutamos 'npm install'.

## Ejecución ##

Para iniciar el servicio:

```console
npm start
```

Para obtener Test-Automáticos, Code coverage:

```console
npm run coverage
```

O solo los Test-Automáticos:

```console
npm test
```

## Si quisieramos correr el sistema como un servicio vamos a usar supervisor ##
* [Supervisor](http://supervisord.org/installing.html): Oficial
* [Supervisor](https://www.digitalocean.com/community/tutorials/how-to-install-and-manage-supervisor-on-ubuntu-and-debian-vps): DigitalOcean

```bash
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install supervisor
```

## vim /etc/supervisor/conf.d/mercadolibrexmen.conf ##
```bash
[program:scheduler]
directory=/var/www/xmen
command= npm start
autostart=true
autorestart=true
#stderr_logfile=/var/log/mercadolibrexmen.err.log
#stdout_logfile=/var/log/mercadolibrexmen.out.log
```

```bash
sudo supervisorctl reread
sudo supervisorctl update
```