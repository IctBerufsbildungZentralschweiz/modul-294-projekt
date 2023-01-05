<script setup>
// FormView.vue
</script>

<template>
  <div class="container" id="form-view">
    <main class="main">
      <!-- Sidebar -->
      <aside class="sidebar space-y">
        <a href="#" id="logo" class="box logo">
          Feedback Hub
        </a>
        <div class="box">
          <a href="#" id="back-link" class="btn btn--block">
            &larr; Zurück zur Übersicht
          </a>
        </div>
      </aside>

      <!-- Content -->
      <section class="content space-y">
        <div class="box">

          <!-- Formular -->
          <form action="#" class="form-create">
            <div class="form-group">
              <label class="form-label" for="title">Titel</label>
              <input type="text" class="form-control" id="title">
              <div class="form-error" id="error-title">
                Fehlermeldung Titel
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="category">Kategorie</label>
              <select class="form-control" id="category">
                <option class="hidden" value="">-- Bitte wählen</option>
                <option value="Idee">Idee</option>
                <option value="Feature">Feature</option>
                <option value="Bug">Bug</option>
              </select>
              <div class="form-error" id="error-category">
                Fehlermeldung Kategorie
              </div>
            </div>

            <div class="span-full">
              <div class="form-group">
                <label class="form-label" for="text">Feedback-Text</label>
                <textarea rows="6" class="form-control" id="text"></textarea>
                <div class="form-error" id="error-text">
                  Fehlermeldung Text
                </div>
              </div>
            </div>

            <div class="form-actions span-full">
              <button type="submit" id="submit" class="btn btn--primary">
                Feedback erstellen
              </button>
            </div>
          </form>

        </div>
      </section>
    </main>
  </div>
</template>