# Scoped native authoring evidence archive

The original ZIP is split only to avoid the connector large-blob upload stall.
All original proof bytes, failures, drivers and scope limits are unchanged.
Download all five parts into one directory, then reconstruct:

```sh
cat native-authoring-student-base.zip.part-* > native-authoring-student-base.zip
sha256sum native-authoring-student-base.zip
```

Expected reconstructed archive: 1167192 bytes, SHA256 `bcf9c313f6adf2578d34c15e4c4e53e90fb397f30b7916e3294473ee917978eb`.
The ZIP contains68 entries and its own SHA256SUMS. It is evidence, not an
installable distribution. See the parent acceptance record for the explicit
native grading versus controlled-browser boundaries and retained failures.

| Part | Bytes | SHA256 |
| --- | ---: | --- |
| [native-authoring-student-base.zip.part-01](native-authoring-student-base.zip.part-01) | 280000 | `321019037568f71fd73dea2c3b58274c34d06b6e93a715cf0d09caf7427f7159` |
| [native-authoring-student-base.zip.part-02](native-authoring-student-base.zip.part-02) | 280000 | `93fe98f2a9a9e11685c66865cb32547c75e813bd44e9c9b62540a004592e070e` |
| [native-authoring-student-base.zip.part-03](native-authoring-student-base.zip.part-03) | 280000 | `9b57991ec0191f72aee6b02c4d888d34921be5c7c10b39117aa78871b1fb0bd0` |
| [native-authoring-student-base.zip.part-04](native-authoring-student-base.zip.part-04) | 280000 | `5521a96038444858f2b5ebaf9649dafbef4425cc3dcd013bee0febd724e59007` |
| [native-authoring-student-base.zip.part-05](native-authoring-student-base.zip.part-05) | 47192 | `25150e6d1a819393c2a55660c2ec2adc434bcd0d48bc9f34c6ab5c7b6779c44f` |
