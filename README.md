# Proyecto: Mercado Libre | X-Men DNA #

Este repositorio almacena los recursos que son requeridos para la implementación de un sistema destinado a Magneto para la identificación de mutantes.

## Tecnologías ##

* [NodeJS](https://nodejs.org/es/): cluster

## Instalación ##

```console
echo "Estamos corriendo bajo el ecosistema de Linux Mint!"

echo "Actualizamos los repositorios de aplicaciones..."

sudo apt-get update

echo "Instalamos CURL y Node en su versión más reciente de 10..."

sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
sudo npm install -g eslint
sudo npm install -g jshint
sudo npm install -g jshint-esnext

echo "Instalamos 'redis' (master y slave en los puertos 6380 y 6379 respectivamente)..."

cd /tmp
mkdir redis
cd redis/
wget http://download.redis.io/releases/redis-stable.tar.gz
tar xzf redis-stable.tar.gz
cd redis-stable
make
make install

REDIS_PORT=6379 \
REDIS_CONFIG_FILE=/etc/redis/6379.conf \
REDIS_LOG_FILE=/var/log/redis_6379.log \
REDIS_DATA_DIR=/var/lib/redis/6379 \
REDIS_EXECUTABLE=`command -v redis-server` ./utils/install_server.sh

REDIS_PORT=6380 \
REDIS_CONFIG_FILE=/etc/redis/6380.conf \
REDIS_LOG_FILE=/var/log/redis_6380.log \
REDIS_DATA_DIR=/var/lib/redis/6380 \
REDIS_EXECUTABLE=`command -v redis-server` ./utils/install_server.sh

service redis_6379 restart
service redis_6380 restart

echo "Instalamos 'mysql'..."

apt-get install mysql-server
```

Tendremos que crear el usuario de MySQL 'root' con clave 'root'

```console
mysql -u root -p
```

```sql
-- ---------------------------------------------------------------------
-- Creamos el usuario 'admin' con todos los privilegios...
-- ---------------------------------------------------------------------
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON * . * TO 'admin'@'localhost';
FLUSH PRIVILEGES;
-- ---------------------------------------------------------------------
-- Creamos la base de datos 'xmendna'...
-- ---------------------------------------------------------------------
CREATE DATABASE xmendna;
USE xmendna;
-- ---------------------------------------------------------------------
-- Creamos la tabla 'xmendna' con sus indices e ID autoincrementable ...
-- ---------------------------------------------------------------------
CREATE TABLE `dnas` (
  `id` int(11) NOT NULL,
  `dna` text COLLATE utf8_unicode_ci NOT NULL,
  `mutant` tinyint(1) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
-- ---------------------------------------------------------------------
ALTER TABLE `dnas` ADD PRIMARY KEY (`id`);
ALTER TABLE `dnas` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
exit;
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
