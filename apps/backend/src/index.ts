import { crearApp } from './app';
import { leerConfig } from './lib/config';

const config = leerConfig();

crearApp(config).listen(config.puerto, () => {
  console.log(
    `Backend de Dictadito en el puerto ${config.puerto} (ambiente ${config.ambiente}, versión ${config.version})`,
  );
});
