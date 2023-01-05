<script setup>
// LoginView.vue
</script>

<template>
  <div class="screen-center" id="login-view">
    <div class="container container--narrower">
      <div class="box">

        <form autocomplete="off" action="#" class="form-login">

          <div class="form-group">
            <label class="form-label" for="email">E-Mail</label>
            <input type="email" class="form-control" id="email">
            <div class="form-error" id="error-email">
              Fehlermeldung E-Mail
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Passwort</label>
            <input type="password" class="form-control" id="password">
            <div class="form-error" id="error-password">
              Fehlermeldung Passwort
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" id="submit" class="btn btn--primary btn--block">
              Log in
            </button>
          </div>
        </form>

      </div>
      <div class="back-link">
        <a href="#">&larr; Zurück zur Übersicht</a>
      </div>
    </div>
  </div>
</template>
