---
layout: branch.njk
title: Home
---

<ns-panel>
  <div class="splash">
    <h1>Nucleus prototype</h1>
  </div>
  <div class="splosh">
    <nav>
      <ul class="ul-bullet">
        {%- for post in collections.all %}
        <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
        {%- endfor -%}
      </ul>
    </nav>
  </div>
</ns-panel>
