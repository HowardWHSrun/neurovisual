# People and research influence

The current release contains **192 sourced profiles and 143 ranked people with complete metrics**. The author audit matched 149 identities; six lack a required metric and remain unranked.

The People & Influence section joins the researcher directory with the individually sourced people already in the company-origin graph. It offers a ranked directory, individual profiles, two-person comparison and a worked explanation of the ranking. Existing researcher-trail URLs remain available.

## What the score means

The research influence index uses OpenAlex author metadata:

| Signal | Weight | Meaning |
| --- | ---: | --- |
| Lifetime citations | 50% | Citations to the author's indexed works at the snapshot date |
| h-index | 30% | An h-index of h requires h indexed works with at least h citations each |
| Recent-paper citations | 20% | Citations to works **published in 2023–2025**, counted at the snapshot date |

The recent signal uses **publication-year cohorts** from the current OpenAlex `counts_by_year` response. It is not citations received during those calendar years. Do not relabel it “recent citations” without the publication-year qualification.

For each metric, rank the eligible cohort from low to high and calculate an average percentile for ties:

`percentile = 100 × (number below + (number equal − 1) / 2) / (cohort size − 1)`

The index is the weighted sum, rounded to one decimal. A singleton cohort uses a neutral percentile of 50. Equal displayed indices share a competition rank. Search and research-area filters preserve ranks relative to the entire eligible cohort. Alternative lenses sort by the selected raw metric while keeping the composite index visible.

The weights are editorial choices, not a validated measurement of overall personal influence. Citations and h-index overlap and depend on career length, field and database coverage. These metrics cover all indexed research fields, not only BCI publications, and are not adjusted for self-citations. Company-building, inventions, mentorship and clinical benefit require separate evidence; the graph relationships do not add numerical points.

## Identity and coverage

Names alone do not establish identity. The snapshot records the selected OpenAlex ID, indexed name, institutional and research-topic evidence, sampled publications and a review reason. Review supports an author match; it does not verify every paper in that author's database aggregate. Known mixed-name records remain unranked with metrics suppressed. Missing metrics are null, never a fabricated zero.

The directory is a selected neuroengineering cohort, not an exhaustive worldwide ranking. Publication affiliations may be historical. Source-backed biographical corrections are kept separately from historical research milestones. Sourced company and mentor relationships are displayed only where the graph already documents them; missing edges mean missing coverage.

## Files and refresh

- `data/people-metrics.json`: dated metrics, identity decisions, paper examples and retrieval sources.
- `data/people-identity.json`: reviewed author identities for controlled refreshes.
- `data/people-connections.json`: canonical links between existing trails and graph people, plus sourced affiliation corrections.
- `data/people-profiles.json`: additional graph-person biographies and sourced name corrections.
- `scripts/update-people.py`: cached, retryable metadata collection using reviewed identities. Use `--refresh-cache` for new requests or `--offline` to replay the dated cache. Consult `--help` before refreshing; a failed request must not silently turn an author into a zero. Scoped `--ids` or `--limit` runs produce partial output and must use an explicit temporary `--output`, never the production snapshot.
- `scripts/build-people.mjs`: joins the records and emits `dist/people-data.js` and `downloads/people-influence.csv`.
- `src/people.ts` / `people.css`: the public interface and ranking function. CSV generation executes the same pure ranking module; checks independently reproduce the arithmetic.

The public page uses a committed snapshot. It does not send visitor searches to OpenAlex or require a browser API key. See [OpenAlex author documentation](https://help.openalex.org/data/authors/) and [API documentation](https://help.openalex.org/api/).

## Validation

`pnpm test` includes a minimum of 100 identity-matched ranked people, unique author IDs, source presence, missing-data handling, independently reproduced indices, tie behavior, stable filtered ranks, all profile renders, safe escaping, publication-year sums and downloadable CSV coverage. Browser checks cover the desktop ranking, small-screen layouts, filters, back/forward navigation, comparison and the worked explanation.
