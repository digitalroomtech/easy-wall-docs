# easy-wall-docs


```js
<script
    async
    src="https://code.digitalroom.tech/easy-wall.js"
    data-content-note-id="content-note"
    data-type-note-id="type-note"
    data-header-id="content-profile"
    data-number-of-attempts="10"
    data-url-client="[url-client]"
    data-url-allowed="[url-allowed]"
    data-url-server="[url-server]"
></script>
```

## Implementación

**Contenido de la nota:** agregar en el tag que englobe el contenido que se desea bloquear el atributo `style="visibility:hidden"` para ocultarlo y agregarle un identificador para que pueda ser procesado por el easy wall script.

#### Ejemplo:
```html
<div id="content-note" style="visibility: hidden">
    <div class="row">
        <!-- contenido-->
    </div>
</div>
```

**Contenido del tipo de nota:** ITER se encarga de validar el tipo de contenido si es `exclusivo` o `registrado`. Actualmente dentro de las plantillas de ITER se muestra de la siguiente manera:

```html
<div class="product" data="$product"></div>
```

y debe actualizarse a :

```html
<div id="type-note" data-id="$product"></div>
```

**Contenido del perfil**: Se debe identificar el lugar donde se colocara la etiqueta con un identificador para que pueda ser procesador por el easy wall script

#### Ejemplo:
```html
<div id="content-profile"></div>
```

**Posición del script:** El easy wall script se puede posicionar en cualquier parte del documento html ya que se ejecuta al momento de haber culminado el renderizado del html.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
             <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
                         <meta http-equiv="X-UA-Compatible" content="ie=edge">
             <title>Easy Wall Script</title>
</head>
<body>
  <header>
      <div id="content-profile"></div>
  </header>
  <div id="type-note" data-id="exclusivos"></div>

  <div id="content-note" style="visibility: hidden">
      <div class="row">
          <!-- contenido-->
      </div>
  </div>
  <script async>
      // Colocar la informacion del script easy wall aca
  </script>
</body>

</html>

```