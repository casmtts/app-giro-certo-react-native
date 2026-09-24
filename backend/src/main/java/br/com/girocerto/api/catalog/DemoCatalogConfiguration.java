package br.com.girocerto.api.catalog;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DemoCatalogConfiguration {
    @Bean
    CommandLineRunner seedDemoCatalog(MotorcycleRepository motorcycles) {
        return args -> {
            if (motorcycles.count() > 0) {
                return;
            }
            motorcycles.saveAll(List.of(
                    new Motorcycle(
                            "Honda", "CBR 600RR", "600RR", 2007, 42000, 600,
                            new BigDecimal("27990.00"), "ESPORTIVA", "Belo Horizonte", "MG",
                            "PRIVATE", "Vendedor particular", false,
                            "Moto esportiva usada como exemplo para o catálogo local. Consulte o vendedor para confirmar os detalhes do anúncio.",
                            "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85"
                    ),
                    new Motorcycle(
                            "Kawasaki", "Ninja 300", "ABS", 2014, 50000, 300,
                            new BigDecimal("17990.00"), "ESPORTIVA", "São Paulo", "SP",
                            "DEALER", "Loja Giro Certo (demonstração)", true,
                            "Anúncio demonstrativo de loja. Confirme histórico e condições diretamente com o vendedor.",
                            "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85"
                    ),
                    new Motorcycle(
                            "Yamaha", "XJ6N", "600", 2013, 38500, 600,
                            new BigDecimal("32500.00"), "NAKED", "Goiânia", "GO",
                            "PRIVATE", "Vendedor particular", false,
                            "Anúncio demonstrativo para navegação e busca. Dados podem ser editados no backend.",
                            "https://images.unsplash.com/photo-1558981852-426c6c22a060?auto=format&fit=crop&w=1200&q=85"
                    ),
                    new Motorcycle(
                            "Honda", "XRE 300 Rally", "ABS", 2021, 18000, 300,
                            new BigDecimal("25990.00"), "TRAIL", "Curitiba", "PR",
                            "DEALER", "Loja Giro Certo (demonstração)", true,
                            "Anúncio demonstrativo de loja. Consulte o vendedor para informações atualizadas.",
                            "https://images.unsplash.com/photo-1609630875171-b1321377ee65?auto=format&fit=crop&w=1200&q=85"
                    )
            ));
        };
    }
}
