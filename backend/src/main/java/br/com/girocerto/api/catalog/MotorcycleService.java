package br.com.girocerto.api.catalog;

import br.com.girocerto.api.common.ResourceNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;

@Service
public class MotorcycleService {
    private final MotorcycleRepository motorcycles;

    public MotorcycleService(MotorcycleRepository motorcycles) {
        this.motorcycles = motorcycles;
    }

    @Transactional(readOnly = true)
    public List<MotorcycleResponse> search(
            String q,
            String category,
            String brand,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Integer yearFrom,
            Integer yearTo,
            Integer minCc,
            Integer maxCc,
            Integer maxMileage,
            String city,
            String state
    ) {
        return motorcycles.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .filter(moto -> contains(moto.getBrand() + " " + moto.getModel() + " " + moto.getVersion(), q))
                .filter(moto -> matches(moto.getCategory(), category))
                .filter(moto -> contains(moto.getBrand(), brand))
                .filter(moto -> minPrice == null || moto.getPrice().compareTo(minPrice) >= 0)
                .filter(moto -> maxPrice == null || moto.getPrice().compareTo(maxPrice) <= 0)
                .filter(moto -> yearFrom == null || moto.getYear() >= yearFrom)
                .filter(moto -> yearTo == null || moto.getYear() <= yearTo)
                .filter(moto -> minCc == null || moto.getDisplacementCc() >= minCc)
                .filter(moto -> maxCc == null || moto.getDisplacementCc() <= maxCc)
                .filter(moto -> maxMileage == null || moto.getMileage() <= maxMileage)
                .filter(moto -> contains(moto.getCity(), city))
                .filter(moto -> matches(moto.getState(), state))
                .map(MotorcycleResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MotorcycleResponse get(Long id) {
        return motorcycles.findById(id)
                .map(MotorcycleResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Anúncio não encontrado."));
    }

    private boolean contains(String value, String query) {
        return query == null || query.isBlank() || normalize(value).contains(normalize(query));
    }

    private boolean matches(String value, String query) {
        return query == null || query.isBlank() || normalize(value).equals(normalize(query));
    }

    private String normalize(String value) {
        return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();
    }
}
