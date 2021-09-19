# Guard

Simple **Express** package for authorization handlers, using JWT and Typescript

### Getting Started

1. add environment variables to .env

```bash
GUARD_SIGNATURE="secret"
GUARD_ALGORITHM="HS512"
GUARD_EXPIRESIN="30d"
```

2.  change signature secret to a safe value

3.  import guard

```js
import { guard } from '@ogabrielaraujo/guard'

app.use(guard)
```

### Examples

**- Middleware guard**

```js
import express from 'express'
import { guard } from '@ogabrielaraujo/guard'

const app = express()

app.use(guard)

app.get('/', (req, res) => {
  console.log(req.token)
  console.log(req.payload)
  console.log(req.user_email)
  res.json({ status: true })
})

app.listen(3000)
```

**- Generating token**

```js
import express from 'express'
import { generate } from '@ogabrielaraujo/guard'

const app = express()

app.get('/register', (req, res) => {
  const token = generate('test@test.com')

  res.json({ token })
})

app.listen(3000)
```

**- Validating token**

```js
import express from 'express'
import { generate, verify } from '@ogabrielaraujo/guard'

const app = express()

app.get('/profile', (req, res) => {
  const exampleToken = generate('test@test.com')

  const { email } = verify(exampleToken)

  res.json({ email })
})

app.listen(3000)
```
