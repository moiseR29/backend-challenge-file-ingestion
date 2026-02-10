# Solución del Challenge

- [Descripción](#descripción)
- [Arquitectura](#arquitectura)
- [Ejecución](#ejecucion)
- [k8s](#k8s)

## Descripción

Aprovechando Kubernetes, mi solución está basada en una arquitectura orientada a eventos. ¿Por qué? Mejor escalabilidad y mejor desacople de las partes.
Por un lado, el proceso de recibir el archivo y subirlo a un storage, para luego publicar según lógica de negocio en un queue para un proceso asincrónico.
Por otro lado, un worker que escucha esta queue y va reaccionando según los jobs comprendidos en la misma.

Todo el entorno puede ejecutarse localmente usando Docker, simulando cloud con localstack.
Toda la solución está pensada para ejecutar localmente.

## Arquitectura

### Stack

- API: Node - Typescript
- Worker: Node - Typescript
- DATABASE: Sql Server - Docker
- CLOUD: AWS LOCALSTACK - Docker
  - SQS
  - S3

### Flujo

1. [API] - Cliente envía el archivo a procesar a la API.
2. [API] - La API analiza el archivo y lo guarda en el storage.
3. [API] - Guarda la data correspondiente en las tablas Jobs y Chunks
4. [API] - Publica cada Chunks a procesar en la queue
5. [QUEUE] - Luego de un tiempo ( según reglas de negocio ), pone disponible los chunks para ser procesados.
6. [WORKER] - El worker detecta que hay chunks por ser procesados, así que los ejecuta.
7. [WORKER] - Una vez procesador lleva el informe a la tabla chunks.

### Aclaraciones del flujo

#### AWS
Sí, mi mayor experiencia está con AWS, no tuve la oportunidad aún de laburar con otro cloud. Sí, en principio con Azure, pero fue muy muy casual.

#### "El worker detecta"
Esto debería ser una regla de kubernetes. He trabajado con Kubernetes ( no mucho ), pero sé que se puede crear una regla configurada para escuchar al exterior y teniendo en cuenta la queue, que solo se creen los worker siempre y cuando existan en la queue.
Yo iría por 1 chunk = 1 worker. ¿Puede que se generen muchos? Sí, pero tienes menor cuello de botella; esto obviamente depende mucho del análisis de infra, con respecto a datos, tiempo promedio de proceso y demás..

#### "Una vez procesador lleva el informe a la tabla chunks"
En la solución provista no maneje los errores, simplemente se informan por consola.
Pero con estos se podría crear alguna tabla con las líneas de errores, o enviar las líneas a un Slack, se puede hacer muchas cosas, incluso llevarlas a alguna DLQ y algún lambda que las procese.

#### QUEUE
La Queue por las reglas, tiene 3 reintentos. Más allá de eso, nos da un mejor control, ya que son servicios que están pensandos para este tipo de casos.

#### Beneficios

- Procesamiento asincrono
- Desacoplamiento
- Escalabilidad horizontal

## Ejecución

### docker compose

1. hay un archivo start.sh, darle permisos ( esta pensado para usarse en linux o git bash ).
```sh
chmod +x ./start.sh
```

2. el mismo bin, te da las opciones.

### API

- process

```curl
curl --request POST \
  --url http://localhost:3000/process \
  --header 'Content-Type: multipart/form-data' \
  --form file=<YOUR_PATH_TO_PROJECT>/backend-challenge-file-ingestion/data-generator/challenge/input/CLIENTES_IN_0425.dat
```

- La respuesta contiene
  - jobId: uuid del job
  - totalLines
  - chunkSize: el valor por el cual se tendra en cuenta la separacion de las lineas, cuando se procese
  - chunksCreated: segund el size, cuantos chunks fueron creados.

```json
{
	"jobId": "113364d5-b6f6-42ac-9221-e80d7468b01e",
	"totalLines": 900000,  
	"chunksCreated": 90,
	"chunkSize": 10000
}
```

## K8s

Como aclare en un principio, esto está pensado para correr sobre kubernetes. La solución la hice usando docker-compose, para facilitar la idea del desarrollo.
Aclarado esto, no use mucho tiempo kubernetes, pero en la carpeta k8s, dejo como deberían ser los manifiestos para la ejecución.

