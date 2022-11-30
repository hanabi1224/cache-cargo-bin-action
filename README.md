# cache-cargo-bin-action

This action caches binaries installed via `cargo install`.

# Features

- automatically update cache when new bin versions are installed.

# Usage

```yaml
- uses: hanabi1224/cache-cargo-bin-action@v1.0.0
- run: cargo install --locked [bins]
  # This flag makes the binaries much smaller
  env:
    RUSTFLAGS: "-Cstrip=symbols"
```
