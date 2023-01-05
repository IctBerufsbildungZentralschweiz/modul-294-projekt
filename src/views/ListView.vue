<script setup>
import LoaderSvg from '../components/icons/LoaderSvg.vue'
import IconComment from '../components/icons/IconComment.vue'
</script>

<template>
  <div class="container" id="list-view">
    <main class="main">

      <!-- Sidebar -->
      <aside class="sidebar space-y">
        <a href="#" id="logo" class="box logo">
          Feedback Hub
        </a>

        <!-- Filter -->
        <div class="box filter-box">
          <div class="box-header">
            <h3 class="box-title">Filter</h3>

            <a href="#" id="filter-reset" class="box-link">
              Zurücksetzen
            </a>
          </div>

          <ul class="filter">
            <li>
              <a href="#" class="filter-link active">
                Idee
              </a>
            </li>
            <li>
              <a href="#" class="filter-link">
                Feature
              </a>
            </li>
            <li>
              <a href="#" class="filter-link">
                Bug
              </a>
            </li>
          </ul>
        </div>
      </aside>

      <section class="content space-y">

        <!-- Toolbar -->
        <div class="box toolbar">
          <div class="status-label">
            12 Einträge
          </div>
          <div>
            <a href="#" class="btn btn-create">
              Feedback erstellen
            </a>
          </div>
        </div>

        <div>

          <!-- Feedbacks -->
          <div class="feedback-list space-y">

            <!-- Feedback -->
            <div class="box feedback">

              <!-- Voter -->
              <div>
                <button class="voter">
                  <div class="voter__action">
                    <svg class="voter__icon" viewBox="0 0 32 32">
                      <path d="m16 6.594-.719.687-12.5 12.5L4.22 21.22 16 9.437 27.781 21.22l1.438-1.438-12.5-12.5Z"/>
                    </svg>
                  </div>
                  <div class="voter__number">
                    88
                  </div>
                </button>
              </div>

              <!-- Feedback Details -->
              <div>
                <h2 class="feedback__title">
                  Feeedback Titel
                </h2>
                <div class="feedback__category">
                  Feedback Kategorie
                </div>
                <p class="feedback__text">
                  Feedback Text
                </p>

                <!-- Feedback Kommentare (ausgeblendet, wenn reduziert) -->
                <div class="feedback__comments">
                  <!-- Feedback Kommentar -->
                  <div class="comment">
                    <p class="comment__title">
                      <strong>Kommentar Autor</strong>
                    </p>
                    <p class="comment__text">
                      Kommentar Text
                    </p>
                  </div>
                </div>

              </div>

              <div class="feedback__meta">
                <div class="feedback__comment-indicator">
                  <div>
                    <IconComment/>
                  </div>
                  <div class="feedback__comments-count">
                    12
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Loader -->
          <div class="loader">
            <div>
              <LoaderSvg/>
            </div>
            <div>
              Lade...
            </div>
          </div>

        </div>
      </section>
    </main>
  </div>
</template>
