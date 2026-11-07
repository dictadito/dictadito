# 0003 · Sumar sin trabar a nadie

- **Fecha:** 7 de noviembre de 2026
- **Estado:** decidido
- **Decidió:** Luca, como administrador del repo. Queda en el plan de trabajo para charlarlo entre los tres.

## Decisión

- **Suma automática activada** (**Allow auto-merge**). Al entregar, quien hizo la tarea toca **Enable auto-merge** y GitHub la suma sola cuando se cumple todo: los controles en verde y, si era delicada, el OK de otro.
- **`staging` ya no exige que la rama esté al día** (**Require branches to be up to date before merging**: no). Ya no hace falta tocar **Update branch** cada vez que entra otra propuesta antes.
- **Cada uno suma lo suyo.** Lo que no es delicado no espera a nadie.
- **El OK, desde el celular.** Cada uno tiene la app de GitHub, que avisa cuando un compañero necesita su OK. Para poder decidir desde ahí, `/listo` escribe arriba de cada propuesta delicada un bloque **Para quien aprueba**: qué cambia, por qué es delicada y qué conviene mirar.

## Por qué

Al principio cada propuesta esperaba a que alguien la sumara, a que otro la aprobara si era delicada y a que alguien la pusiera al día si entraba otra antes. Cada paso dependía de que alguien estuviera en la compu. Con cuatro propuestas en fila, había que tocar **Update branch** después de cada una.

## Qué implica

- Las reglas que cuidan siguen igual: nada entra con los controles en rojo, lo delicado espera el OK de otro, si alguien sube algo después del OK la aprobación se cae, y a `main` solo se llega con aprobación.
- La combinación de dos propuestas se prueba después de entrar, porque los controles corren en `staging` después de cada suma. Si dos chocan, `staging` se pone en rojo y se deshace o se arregla con una propuesta chica. A las docentes no les llega nada, porque `main` pide aprobación.
- Aprobar sigue siendo mirar. Si algo no se entiende desde el celular, no se aprueba: se pregunta en el grupo o se mira con Claude en la compu.
- Claude no suma ni activa la suma automática: lo toca la persona. El freno de Claude sigue bloqueando `gh pr merge`.

## Qué se descartó

- **Dejarlo como estaba y acostumbrarse:** los botones que GitHub puede tocar solo no aportan control.
- **Una fila de espera de GitHub (merge queue):** pone al día y prueba cada propuesta antes de sumarla, pero no está disponible para repos de una cuenta personal.
